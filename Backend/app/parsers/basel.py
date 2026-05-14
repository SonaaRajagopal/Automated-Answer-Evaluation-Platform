from typing import Dict


def parse_basel_chunk(chunk: dict) -> str:
    """Parser for Basel 3.1 Rulebook format (structured_data-based)."""
    structured_data = chunk.get("structured_data", {})
    text_parts = []

    chapter_num = structured_data.get("chapter_number", "N/A")
    chapter_title = structured_data.get("chapter_title", "")
    topic = structured_data.get("topic", "")

    if chapter_num != "N/A" or chapter_title:
        text_parts.append(f"Chapter {chapter_num}: {chapter_title}")
    if topic:
        text_parts.append(f"Topic: {topic}")

    summary = structured_data.get("content_summary", "")
    if summary:
        text_parts.append(f"Summary: {summary}")

    paragraphs = structured_data.get("paragraphs", [])
    for para in paragraphs:
        if isinstance(para, dict):
            para_num = para.get("paragraph_number", "")
            para_text = para.get("text", "").strip()

            if para_text:
                para_header = f"Paragraph {para_num}: " if para_num else ""
                text_parts.append(f"{para_header}{para_text}")

            bullet_points = para.get("bullet_points", [])
            for bullet in bullet_points:
                if bullet.strip():
                    text_parts.append(f"• {bullet}")

    cross_refs = structured_data.get("cross_references", [])
    if cross_refs:
        text_parts.append("Cross References:")
        for ref in cross_refs:
            if isinstance(ref, dict):
                ref_to = ref.get("reference_to", "")
                context = ref.get("context", "")
                if ref_to:
                    text_parts.append(f"• {ref_to}: {context}")

    return "\n".join(filter(None, text_parts))


def extract_basel_metadata(chunk: dict) -> Dict:
    structured_data = chunk.get("structured_data", {})
    return {
        "chapter_number": structured_data.get("chapter_number", "N/A"),
        "chapter_title": structured_data.get("chapter_title", ""),
        "topic": structured_data.get("topic", ""),
        "page_number": structured_data.get("page_number", chunk.get("source_page", "N/A")),
        "content_length": len(parse_basel_chunk(chunk)),
        "document_type": "Basel 3.1 Rulebook",
    }


def citation_basel(meta: dict) -> str:
    return f"Chapter {meta.get('chapter_number', 'N/A')}, Page {meta.get('page_number', 'N/A')}"
