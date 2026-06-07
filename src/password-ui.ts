import { NO_GROUPS_MESSAGE, PasswordGenerator, type PasswordOptions } from "./password-generator";

// --- DOM Utilities ---

export function queryRequired<T extends Element>(selector: string): T {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Missing element: ${selector}`);
    }
    return element as T;
}

function escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function buildColoredPasswordHtml(password: string, colors: string[]): string {
    return [...password].map((char, index) => `<span style="color:${colors[index]}">${escapeHtml(char)}</span>`).join("");
}

// --- Password UI ---

const passwordGenerator = new PasswordGenerator();

const passwordLengthInput = queryRequired<HTMLInputElement>("#passwordLengthInput");
const passwordLengthRange = queryRequired<HTMLInputElement>("#passwordLengthRange");
const lengthDisplay = document.getElementById("lengthDisplay");
const generateNewPasswordButton = queryRequired<HTMLButtonElement>("#generateNewPasswordButton");
const generatedPasswordElement = queryRequired<HTMLParagraphElement>("#generatedPassword");
const copyPasswordButton = queryRequired<HTMLButtonElement>("#copyTextBtn");
const copyBtnIcon = queryRequired<SVGSVGElement>("#copyBtnIcon");
const copyBtnLabel = queryRequired<HTMLSpanElement>("#copyBtnLabel");
const characterGroupsForm = queryRequired<HTMLFormElement>(".characterGroups");

const optionCheckboxes = {
    uppercase: queryRequired<HTMLInputElement>("#option-uppercase"),
    lowercase: queryRequired<HTMLInputElement>("#option-lowercase"),
    numbers: queryRequired<HTMLInputElement>("#option-numbers"),
    symbols: queryRequired<HTMLInputElement>("#option-symbols"),
} as const;

const entropyDisplay = document.getElementById("entropyDisplay");

const ENTROPY_LEVELS = [
    { min: 250, label: "Ultimate", cls: "entropy-ultimate" },
    { min: 200, label: "Excellent", cls: "entropy-excellent" },
    { min: 150, label: "Strong", cls: "entropy-strong" },
    { min: 100, label: "Nice", cls: "entropy-fair" },
] as const;

function updateEntropyDisplay(entropy: number): void {
    if (!entropyDisplay) return;
    const level = ENTROPY_LEVELS.find((l) => entropy >= l.min)!;
    entropyDisplay.className = `entropy-display ${level.cls}`;
    entropyDisplay.textContent = `${entropy.toFixed(1)} bits — ${level.label}`;
}

const COPY_ICON_PATH = "M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z";
const CHECK_ICON_PATH = "M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z";
const COPY_FEEDBACK_MS = 1800;

let copyFeedbackTimeout: ReturnType<typeof setTimeout> | undefined;

function readPasswordOptions(): PasswordOptions {
    return {
        uppercase: optionCheckboxes.uppercase.checked,
        lowercase: optionCheckboxes.lowercase.checked,
        numbers: optionCheckboxes.numbers.checked,
        symbols: optionCheckboxes.symbols.checked,
    };
}

function syncPasswordLength(value: string): void {
    passwordLengthInput.value = value;
    passwordLengthRange.value = value;
    if (lengthDisplay) {
        lengthDisplay.textContent = value;
    }
}

function setCharacterGroupsError(hasError: boolean): void {
    characterGroupsForm.classList.toggle("has-error", hasError);
}

function updateGeneratedPassword(): void {
    const length = parseInt(passwordLengthInput.value, 10);
    const result = passwordGenerator.generate(length, readPasswordOptions());

    if (!result.ok) {
        setCharacterGroupsError(true);
        generatedPasswordElement.textContent = result.message;
        return;
    }

    setCharacterGroupsError(false);
    generatedPasswordElement.innerHTML = buildColoredPasswordHtml(result.password, result.colors);
    updateEntropyDisplay(result.entropy);
}

function setCopyButtonCopied(copied: boolean): void {
    copyPasswordButton.classList.toggle("is-copied", copied);
    copyBtnLabel.textContent = copied ? "Copied" : "Copy";
    copyPasswordButton.setAttribute("aria-label", copied ? "Password copied" : "Copy password");
    copyBtnIcon.innerHTML = `<path d="${copied ? CHECK_ICON_PATH : COPY_ICON_PATH}" />`;
}

function showCopyFeedback(): void {
    setCopyButtonCopied(true);
    clearTimeout(copyFeedbackTimeout);
    copyFeedbackTimeout = setTimeout(() => setCopyButtonCopied(false), COPY_FEEDBACK_MS);
}

function copyGeneratedPassword(): void {
    const passwordText = generatedPasswordElement.textContent ?? "";
    if (!passwordText || passwordText === NO_GROUPS_MESSAGE) return;
    void navigator.clipboard.writeText(passwordText);
    showCopyFeedback();
}

export function initPasswordControls(): void {
    passwordLengthInput.addEventListener("input", () => {
        syncPasswordLength(passwordLengthInput.value);
        updateGeneratedPassword();
    });

    passwordLengthRange.addEventListener("input", () => {
        syncPasswordLength(passwordLengthRange.value);
        updateGeneratedPassword();
    });

    for (const checkbox of Object.values(optionCheckboxes)) {
        checkbox.addEventListener("change", updateGeneratedPassword);
    }

    generateNewPasswordButton.addEventListener("click", updateGeneratedPassword);
    copyPasswordButton.addEventListener("click", copyGeneratedPassword);
    generatedPasswordElement.addEventListener("click", copyGeneratedPassword);

    updateGeneratedPassword();
}
