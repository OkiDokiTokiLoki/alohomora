const DEFAULT_THEME = "dark";

const body = document.body;
const themeContainer = document.getElementById("theme-container");

function setActiveThemeButton(theme: "dark" | "light"): void {
    document.getElementById("dark")?.classList.toggle("active", theme === "dark");
    document.getElementById("light")?.classList.toggle("active", theme === "light");
}

function setTheme(theme: "dark" | "light"): void {
    body.classList.remove("dark", "light");
    body.classList.add(theme);
    setActiveThemeButton(theme);
}

function setSolarActive(isActive: boolean): void {
    document.getElementById("solar")?.classList.toggle("active", isActive);
}

function toggleSolar(): void {
    body.classList.toggle("solar");
    setSolarActive(body.classList.contains("solar"));
}

function handleThemeClick(event: MouseEvent): void {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("#theme-container button");
    if (!button) return;

    switch (button.id) {
        case "solar":
            toggleSolar();
            break;
        case "dark":
            setTheme("dark");
            break;
        case "light":
            setTheme("light");
            break;
    }
}

export function initTheme(): void {
    body.classList.add(DEFAULT_THEME);
    setActiveThemeButton(DEFAULT_THEME);

    if (themeContainer) {
        themeContainer.addEventListener("click", handleThemeClick);
    }
}
