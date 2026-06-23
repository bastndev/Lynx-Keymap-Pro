import re
import sys
import asyncio

try:
    from deep_translator import GoogleTranslator
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "deep_translator"])
    from deep_translator import GoogleTranslator

def translate_markdown(text, target_lang):
    # This is a naive translation that might break markdown, so let's not use it on the whole file directly if possible,
    # but since it's just a README, maybe we can use a script.
    pass
