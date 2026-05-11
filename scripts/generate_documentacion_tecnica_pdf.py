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
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "docs" / "documentacion-tecnica.md"
OUTPUT = ROOT / "Documentacion_Tecnica_SIGR.pdf"


def clean_inline(text):
    return (
        text.replace("**", "")
        .replace("`", "")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def image_path_from_markdown(line):
    if not line.startswith("![") or "](" not in line or not line.endswith(")"):
        return None
    relative = line.split("](", 1)[1][:-1]
    return SOURCE.parent / relative


def build_story():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="Small", parent=styles["BodyText"], fontSize=8, leading=10))
    styles.add(ParagraphStyle(name="CodeBlock", parent=styles["Code"], fontSize=7.5, leading=9))
    styles["Title"].fontSize = 18
    styles["Heading1"].fontSize = 14
    styles["Heading2"].fontSize = 11

    story = []
    bullet_buffer = []
    table_buffer = []
    code_buffer = []
    in_code = False

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
            table = Table(rows, repeatRows=1, hAlign="LEFT")
            table.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#f3f4f6")),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#d1d5db")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
            ]))
            story.append(table)
            story.append(Spacer(1, 0.12 * inch))
            table_buffer = []

    def flush_code():
        nonlocal code_buffer
        if code_buffer:
            story.append(Preformatted("\n".join(code_buffer), styles["CodeBlock"]))
            story.append(Spacer(1, 0.1 * inch))
            code_buffer = []

    for line in SOURCE.read_text(encoding="utf-8").splitlines():
        stripped = line.strip()

        if stripped.startswith("```"):
            if in_code:
                in_code = False
                flush_code()
            else:
                flush_bullets()
                flush_table()
                in_code = True
            continue

        if in_code:
            code_buffer.append(line)
            continue

        if not stripped:
            flush_bullets()
            flush_table()
            story.append(Spacer(1, 0.06 * inch))
            continue

        if stripped.startswith("|") and not stripped.startswith("| ---"):
            flush_bullets()
            table_buffer.append([cell for cell in stripped.strip("|").split("|")])
            continue

        if stripped.startswith("| ---"):
            continue

        flush_table()

        markdown_image = image_path_from_markdown(stripped)
        if markdown_image and markdown_image.exists():
            flush_bullets()
            image = Image(str(markdown_image))
            image._restrictSize(6.6 * inch, 3.8 * inch)
            story.append(image)
            story.append(Spacer(1, 0.16 * inch))
            continue

        if stripped.startswith("# "):
            flush_bullets()
            story.append(Paragraph(clean_inline(stripped[2:]), styles["Title"]))
            story.append(Spacer(1, 0.16 * inch))
            continue

        if stripped.startswith("## "):
            flush_bullets()
            story.append(Spacer(1, 0.08 * inch))
            story.append(Paragraph(clean_inline(stripped[3:]), styles["Heading1"]))
            continue

        if stripped.startswith("### "):
            flush_bullets()
            story.append(Paragraph(clean_inline(stripped[4:]), styles["Heading2"]))
            continue

        if stripped == "---":
            story.append(PageBreak())
            continue

        if stripped.startswith("- "):
            bullet_buffer.append(stripped[2:])
            continue

        story.append(Paragraph(clean_inline(stripped), styles["BodyText"]))

    flush_bullets()
    flush_table()
    flush_code()
    return story


def main():
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.6 * inch,
        leftMargin=0.6 * inch,
        topMargin=0.55 * inch,
        bottomMargin=0.55 * inch,
        title="Documentacion Tecnica SIGR",
    )
    doc.build(build_story())
    print(f"PDF generado: {OUTPUT}")


if __name__ == "__main__":
    main()
