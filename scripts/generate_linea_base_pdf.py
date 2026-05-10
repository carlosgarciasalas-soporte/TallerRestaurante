from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    Image,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "linea-base.md"
OUTPUT = ROOT / "Taller_LineaBase_SIGR.pdf"
PREVIEW = ROOT / "docs" / "assets" / "dashboard-preview-v2.png"


def clean_inline(text):
    return (
        text.replace("**", "")
        .replace("`", "")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def build_story():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Small", parent=styles["BodyText"], fontSize=8, leading=10))
    styles["Title"].fontSize = 20
    styles["Heading1"].fontSize = 15
    styles["Heading2"].fontSize = 12
    story = []
    bullet_buffer = []
    table_buffer = []

    def flush_bullets():
        nonlocal bullet_buffer
        if bullet_buffer:
            story.append(ListFlowable([ListItem(Paragraph(clean_inline(item), styles["BodyText"])) for item in bullet_buffer], bulletType="bullet"))
            story.append(Spacer(1, 0.08 * inch))
            bullet_buffer = []

    def flush_table():
        nonlocal table_buffer
        if table_buffer:
            rows = [[Paragraph(clean_inline(cell.strip()), styles["Small"]) for cell in row] for row in table_buffer]
            col_widths = None
            if len(table_buffer[0]) == 5:
                col_widths = [0.62 * inch, 0.48 * inch, 0.88 * inch, 1.65 * inch, 3.05 * inch]
            table = Table(rows, repeatRows=1, hAlign="LEFT", colWidths=col_widths)
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f0f4f8")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#ccd6dd")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
            ]))
            story.append(table)
            story.append(Spacer(1, 0.14 * inch))
            table_buffer = []

    lines = SOURCE.read_text(encoding="utf-8").splitlines()
    for line in lines:
        stripped = line.strip()
        if not stripped:
            flush_bullets()
            flush_table()
            story.append(Spacer(1, 0.08 * inch))
            continue
        if stripped.startswith("|") and not stripped.startswith("| ---"):
            flush_bullets()
            table_buffer.append([cell for cell in stripped.strip("|").split("|")])
            continue
        if stripped.startswith("| ---"):
            continue
        flush_table()
        if stripped.startswith("# "):
            flush_bullets()
            story.append(Paragraph(clean_inline(stripped[2:]), styles["Title"]))
            story.append(Spacer(1, 0.14 * inch))
            if PREVIEW.exists():
                image = Image(str(PREVIEW))
                image._restrictSize(6.4 * inch, 3.2 * inch)
                story.append(image)
                story.append(Spacer(1, 0.18 * inch))
            continue
        if stripped.startswith("## "):
            flush_bullets()
            story.append(Spacer(1, 0.08 * inch))
            story.append(Paragraph(clean_inline(stripped[3:]), styles["Heading1"]))
            continue
        if stripped.startswith("- "):
            bullet_buffer.append(stripped[2:])
            continue
        story.append(Paragraph(clean_inline(stripped), styles["BodyText"]))

    flush_bullets()
    flush_table()
    return story


def main():
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Línea Base Software de Restaurante",
    )
    doc.build(build_story())
    print(f"PDF generado: {OUTPUT}")


if __name__ == "__main__":
    main()
