import "./style.css";

class PasswordGenerator {
	private uppercaseLetters: string = "ABCDEFGHJKLMNPQRSTUVWXYZ";
	private lowercaseLetters: string = "abcdefghijkmnopqrstuvwxyz";
	private numbers: string = "23456789";
	private specialCharacters: string = "!@#$%^&*()_+-={};:,.<>?~/";

	generatePassword(length: number, options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }): { password: string; colors: string[] } {
		const allCharacters = [
			{ chars: this.uppercaseLetters, enabled: options.uppercase, color: "var(--uppercase-group)" },
			{ chars: this.lowercaseLetters, enabled: options.lowercase, color: "var(--lowercase-group)" },
			{ chars: this.numbers, enabled: options.numbers, color: "var(--number-group)" },
			{ chars: this.specialCharacters, enabled: options.symbols, color: "var(--symbol-group)" },		];

		let password = "";
		let colors: string[] = [];
		let usedCharacters = new Set<string>(); // Sets contain unique values

		for (let i = 0; i < length; i++) {
			const enabledGroups = allCharacters.filter((group) => group.enabled); // Filter out disabled character groups

			if (enabledGroups.length === 0) {
				return { password: "No character groups active :(", colors: [] };
			}

			const randomGroupIndex = Math.floor(Math.random() * enabledGroups.length);
			const group = enabledGroups[randomGroupIndex];

			const availableChars = Array.from(group.chars).filter((char) => !usedCharacters.has(char)); // Filter out characters already used in this group

			if (availableChars.length === 0) {
				usedCharacters.clear(); // If all characters in the group have been used, reset the set and try again
				i--; // Decrement i to re-generate this position in the password
			} else {
				const randomIndex = Math.floor(Math.random() * availableChars.length);
				const selectedChar = availableChars[randomIndex];
				password += selectedChar;
				colors.push(group.color);
				usedCharacters.add(selectedChar);
			}
		}

		return { password, colors };
	}
}

const passwordGenerator = new PasswordGenerator();

const passwordLengthInput = document.querySelector("#passwordLengthInput") as HTMLInputElement;
const passwordLengthRange = document.querySelector("#passwordLengthRange") as HTMLInputElement;
const generateNewPasswordButton = document.querySelector("#generateNewPasswordButton") as HTMLButtonElement;
const generatedPasswordElement = document.querySelector("#generatedPassword") as HTMLParagraphElement;
const copyPasswordButton = document.querySelector("#copyTextBtn") as HTMLButtonElement;

const uppercaseCheckbox = document.querySelector("#option-uppercase") as HTMLInputElement;
const lowercaseCheckbox = document.querySelector("#option-lowercase") as HTMLInputElement;
const numbersCheckbox = document.querySelector("#option-numbers") as HTMLInputElement;
const symbolsCheckbox = document.querySelector("#option-symbols") as HTMLInputElement;

function updateGeneratedPassword() {
	const passwordLength = parseInt(passwordLengthInput.value, 10);
	const options = {
		uppercase: uppercaseCheckbox.checked,
		lowercase: lowercaseCheckbox.checked,
		numbers: numbersCheckbox.checked,
		symbols: symbolsCheckbox.checked,
	};

	const { password, colors } = passwordGenerator.generatePassword(passwordLength, options);
	const formElement = document.querySelector(".characterGroups") as HTMLFormElement;

	if (password === "No character groups active :(") {
		formElement.style.border = "5px solid hsl(330, 88%, 55%)";
	} else {
		formElement.style.border = "5px solid transparent";
	}

	const coloredPassword = password
		.split("")
		.map((char, index) => `<span style="color:${colors[index]}">${char}</span>`)
		.join("");

	generatedPasswordElement.innerHTML = `${coloredPassword}`;
}

passwordLengthInput.addEventListener("input", () => {
	passwordLengthRange.value = passwordLengthInput.value;
	updateGeneratedPassword();
});

passwordLengthRange.addEventListener("input", () => {
	passwordLengthInput.value = passwordLengthRange.value;
	updateGeneratedPassword();
});

uppercaseCheckbox.addEventListener("change", updateGeneratedPassword);
lowercaseCheckbox.addEventListener("change", updateGeneratedPassword);
numbersCheckbox.addEventListener("change", updateGeneratedPassword);
symbolsCheckbox.addEventListener("change", updateGeneratedPassword);

generateNewPasswordButton.addEventListener("click", updateGeneratedPassword);

function copyToClipboard(text: string) {
	navigator.clipboard.writeText(text);
}

copyPasswordButton.addEventListener("click", () => {
	const passwordText: string = generatedPasswordElement.textContent ?? "";
	copyToClipboard(passwordText);
});

generatedPasswordElement.addEventListener("click", () => {
	const passwordText: string = generatedPasswordElement.textContent ?? "";
	copyToClipboard(passwordText);
});

updateGeneratedPassword();

const body: HTMLElement = document.body;
const themeContainer: HTMLElement | null = document.getElementById('theme-container');

if (themeContainer) {
    themeContainer.addEventListener('click', event => {
        const target = event.target as HTMLElement;
        if (target.id === 'dark' || target.id === 'dark-svg') {
            setTheme('dark');
        } else if (target.id === 'light' || target.id === 'light-svg') {
            setTheme('light');
        } else if (target.id === 'solar' || target.id === 'solar-svg') {
            toggleSolar();
        }
    });
}

function setTheme(theme: string): void {
    body.classList.replace(body.classList.item(0) as string, theme);
}

function toggleSolar(): void {
    const isSolar: boolean = body.classList.contains('solar');
    if (isSolar) {
        body.classList.remove('solar');
    } else {
        body.classList.add('solar');
    }
}

const theme: string = 'dark';
if (theme) {
    body.classList.add(theme);
    if (theme === 'solar') {
        body.classList.add('solar');
    }
}

(() => {
	const container = document.querySelector(".main") as HTMLElement;

	window.onmousemove = (e) => {
		let mouseX = -e.clientX / 50;
		let mouseY = -e.clientY / 50;
		container.style.backgroundPositionX = mouseX + "px";
		container.style.backgroundPositionY = mouseY + "px";
	};
})();
