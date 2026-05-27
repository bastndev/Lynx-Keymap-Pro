import * as vscode from 'vscode';
import { EditorType } from './configs';
import { findEditorFromCommands, hasEditorSignature, isDetectionCacheFresh } from './rules';
import { LOG_PREFIX } from '../../shared/constants';

export class EditorDetector {
  private detectedEditor: EditorType | null       = null;
  private detectedEditorTimestamp: number         = 0;
  private allCommandsCache: Set<string> | null    = null;
  private allCommandsCacheTimestamp: number       = 0;
  private readonly CACHE_EXPIRY                  = 5 * 60 * 1000; // 5 min

  public async detect(): Promise<EditorType> {
    const now = Date.now();
    if (isDetectionCacheFresh(
      this.detectedEditor,
      this.detectedEditorTimestamp,
      now,
      this.CACHE_EXPIRY,
    )) {
      return this.detectedEditor;
    }

    const allCommands = await this.getAllCommands();
    const detectedEditor = findEditorFromCommands(allCommands);
    if (detectedEditor) {
      return this.setDetectedEditor(detectedEditor);
    }

    console.warn(`${LOG_PREFIX} Editor not detected, defaulting to VSCode`);
    return this.setDetectedEditor(EditorType.VSCODE);
  }

  public reset(): void {
    this.detectedEditor            = null;
    this.detectedEditorTimestamp   = 0;
    this.allCommandsCache          = null;
    this.allCommandsCacheTimestamp = 0;
  }

  public async isAvailable(editor: EditorType): Promise<boolean> {
    const allCommands = await this.getAllCommands();
    return hasEditorSignature(editor, allCommands);
  }

  private async getAllCommands(): Promise<Set<string>> {
    const now = Date.now();
    if (
      this.allCommandsCache &&
      now - this.allCommandsCacheTimestamp < this.CACHE_EXPIRY
    ) {
      return this.allCommandsCache;
    }
    try {
      this.allCommandsCache          = new Set(await vscode.commands.getCommands(true));
      this.allCommandsCacheTimestamp = now;
      return this.allCommandsCache;
    } catch (error) {
      console.error(`${LOG_PREFIX} Failed to get commands:`, error);
      return this.allCommandsCache ?? new Set();
    }
  }

  private setDetectedEditor(editor: EditorType): EditorType {
    this.detectedEditor          = editor;
    this.detectedEditorTimestamp = Date.now();
    return editor;
  }
}
