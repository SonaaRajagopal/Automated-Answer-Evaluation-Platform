from typing import Dict


def parse_hkma_chunk(chunk: dict) -> str:
    """Parser for HKMA Rulebook format (structured_data with sections)."""
    structured_data = chunk.get("structured_data", {})
    text_parts = []

    section_num = structured_data.get("section_number", "N/A")
    section_title = structured_data.get("section_title", "")
    part_ref = structured_data.get("part_reference", "")
    division_ref = structured_data.get("division_reference", "")

    if section_num != "N/A":
        header = f"Section {section_num}"
        if section_title:
            header += f": {section_title}"
        text_parts.append(header)

    if part_ref:
        text_parts.append(f"Part: {part_ref}")
    if division_ref:
        text_parts.append(f"Division: {division_ref}")

    summary = structured_data.get("content_summary", "")
    if summary:
        text_parts.append(f"Summary: {summary}")

    paragraphs = structured_data.get("paragraphs", [])
    for para in paragraphs:
        if isinstance(para, dict):
            para_num = para.get("paragraph_number", "")
            para_text = para.get("text", "").strip()

            if para_text:
                para_header = f"({para_num}) " if para_num else ""
                text_parts.append(f"{para_header}{para_text}")

            sub_paras = para.get("sub_paragraphs", [])
            for sub_para in sub_paras:
                if isinstance(sub_para, dict):
                    letter = sub_para.get("letter", "")
                    content = sub_para.get("content", "").strip()

                    if content:
                        sub_header = f"({letter}) " if letter else "• "
                        text_parts.append(f"{sub_header}{content}")

                    sub_items = sub_para.get("sub_items", [])
                    for item in sub_items:
                        if isinstance(item, dict):
                            numeral = item.get("numeral", "")
                            item_content = item.get("content", "").strip()
                            if item_content:
                                item_header = f"({numeral}) " if numeral else "  • "
                                text_parts.append(f"{item_header}{item_content}")

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


def extract_hkma_metadata(chunk: dict) -> Dict:
    structured_data = chunk.get("structured_data", {})
    return {
        "section_number": structured_data.get("section_number", "N/A"),
        "section_title": structured_data.get("section_title", ""),
        "part_reference": structured_data.get("part_reference", ""),
        "division_reference": structured_data.get("division_reference", ""),
        "page_number": structured_data.get("page_number", chunk.get("source_page", "N/A")),
        "content_length": len(parse_hkma_chunk(chunk)),
        "document_type": "HKMA Rulebook",
    }


def citation_hkma(meta: dict) -> str:
    return f"Section {meta.get('section_number', 'N/A')}, Page {meta.get('page_number', 'N/A')}"
