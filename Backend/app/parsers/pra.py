from typing import Dict


def parse_pra_chunk(chunk: dict) -> str:
    """Parser for PRA Rulebook format (extraction-based structure)."""
    extraction = chunk.get("extraction", {})
    text_parts = []

    article_num = extraction.get("article_number", "N/A")
    article_title = extraction.get("article_title", "")
    if article_num != "N/A" or article_title:
        text_parts.append(f"Article {article_num}: {article_title}")

    part_ref = extraction.get("part_reference", "")
    section_ref = extraction.get("section_reference", "")
    if part_ref:
        text_parts.append(f"Part: {part_ref}")
    if section_ref:
        text_parts.append(f"Section: {section_ref}")

    summary = extraction.get("content_summary", "")
    if summary:
        text_parts.append(f"Summary: {summary}")

    paragraphs = extraction.get("paragraphs", [])
    for para in paragraphs:
        if isinstance(para, dict):
            para_text = para.get("text", "").strip()
            if para_text:
                text_parts.append(para_text)

            sub_paras = para.get("sub_paragraphs", [])
            for sub_para in sub_paras:
                if isinstance(sub_para, dict):
                    sub_content = sub_para.get("content", "").strip()
                    if sub_content:
                        text_parts.append(f"• {sub_content}")

    return "\n".join(filter(None, text_parts))


def extract_pra_metadata(chunk: dict) -> Dict:
    extraction = chunk.get("extraction", {})
    return {
        "article_number": extraction.get("article_number", "N/A"),
        "article_title": extraction.get("article_title", ""),
        "part_reference": extraction.get("part_reference", ""),
        "section_reference": extraction.get("section_reference", ""),
        "page_number": chunk.get("page_number", "N/A"),
        "content_length": len(parse_pra_chunk(chunk)),
        "document_type": "PRA Rulebook",
    }


def citation_pra(meta: dict) -> str:
    return f"Article {meta.get('article_number', 'N/A')}, Page {meta.get('page_number', 'N/A')}"
