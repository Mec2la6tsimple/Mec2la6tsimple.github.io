import sys
try:
    from pypdf import PdfReader
    reader = PdfReader('C:/Users/bcop/.gemini/antigravity/scratch/CV_Portfolio.pdf')
    text = '\n'.join(p.extract_text() for p in reader.pages)
    with open('C:/Users/bcop/.gemini/antigravity/scratch/cv_extracted.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Success")
except Exception as e:
    print("Error:", e)
