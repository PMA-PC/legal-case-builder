import { EvidenceItem, JournalEntry, BoardState } from '../types';

/**
 * Safely retrieves an item from localStorage and parses it as JSON.
 * Provides console logging for debugging.
 * @param key The key of the item to retrieve.
 * @param defaultValue The default value to return if the item is not found or parsing fails.
 * @returns The parsed item or the default value.
 */
export function safelyGetItem<T>(key: string, defaultValue: T): T {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      console.log(`[LocalStorage Service] No item found for key: '${key}'. Returning default value.`);
      return defaultValue;
    }
    const parsedState = JSON.parse(serializedState) as T;
    console.log(`[LocalStorage Service] Item '${key}' loaded. Size: ${serializedState.length} bytes. Data:`, parsedState);
    return parsedState;
  } catch (error) {
    console.error(`[LocalStorage Service ERROR] Error loading or parsing item '${key}' from localStorage:`, error);
    alert(`CRITICAL ERROR: Failed to load '${key}' from storage. Your saved data might be corrupted, or there was an issue reading it. The app will reset this section to its default state. Please report this issue and provide console logs if possible. Error: ${error instanceof Error ? error.message : String(error)}`);
    return defaultValue;
  }
}

/**
 * Safely stores an item in localStorage after serializing it to JSON.
 * Provides console logging for debugging and handles QuotaExceededError.
 * @param key The key under which to store the item.
 * @param value The value to store.
 */
export function safelySetItem<T>(key: string, value: T): void {
  try {
    const serializedState = JSON.stringify(value);
    console.log(`[LocalStorage Service] Attempting to save item '${key}'. Estimated size: ${serializedState.length} bytes.`);
    localStorage.setItem(key, serializedState);
    console.log(`[LocalStorage Service] Item '${key}' saved successfully. Actual size: ${serializedState.length} bytes.`);
  } catch (error) {
    console.error(`[LocalStorage Service ERROR] Error saving item '${key}' to localStorage:`, error);
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      alert(`CRITICAL STORAGE WARNING: Local storage limit reached! Your data for '${key}' could not be fully saved.
        This is likely due to too many large files (images/PDFs) being stored directly in your browser.

        ACTION REQUIRED:
        1. Please remove some items, especially large attachments, from the Evidence Board or Journal.
        2. You may also try clearing your browser's site data for this application (Browser Settings > Privacy and Security > Site Settings > Data stored for this site).
        3. Unsaved changes will be lost upon refreshing or closing the application until space is freed.

        Error: ${error.message}`);
    } else {
      alert(`CRITICAL ERROR: Failed to save data for '${key}'. Your changes might be lost. Please report this issue and provide console logs if possible. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
