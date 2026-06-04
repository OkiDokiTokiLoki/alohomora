export type PasswordOptions = {
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
};

type CharacterGroup = {
    chars: string;
    color: string;
};

export type PasswordResult = { ok: true; password: string; colors: string[] } | { ok: false; message: string };

export const NO_GROUPS_MESSAGE = "No character groups active :(";

const CHARACTER_SETS = {
    uppercase: "ABCDEFGHJKLMNPQRSTUVWXYZ",
    lowercase: "abcdefghijkmnopqrstuvwxyz",
    numbers: "23456789",
    symbols: "!@#$%^&*()_+-={};:,.<>?~/",
} as const;

const GROUP_COLORS: Record<keyof PasswordOptions, string> = {
    uppercase: "var(--uppercase-group)",
    lowercase: "var(--lowercase-group)",
    numbers: "var(--number-group)",
    symbols: "var(--symbol-group)",
};

function randomIndex(max: number): number {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    return randomValues[0] % max;
}

function pickRandom<T>(items: T[]): T {
    return items[randomIndex(items.length)];
}

export class PasswordGenerator {
    generate(length: number, options: PasswordOptions): PasswordResult {
        const enabledGroups = this.getEnabledGroups(options);

        if (enabledGroups.length === 0) {
            return { ok: false, message: NO_GROUPS_MESSAGE };
        }

        let password = "";
        const colors: string[] = [];
        const usedInCurrentCycle = new Set<string>();

        for (let position = 0; position < length; position++) {
            const group = pickRandom(enabledGroups);
            const availableChars = [...group.chars].filter((char) => !usedInCurrentCycle.has(char));

            if (availableChars.length === 0) {
                usedInCurrentCycle.clear();
                position--;
                continue;
            }

            const char = pickRandom(availableChars);
            password += char;
            colors.push(group.color);
            usedInCurrentCycle.add(char);
        }

        return { ok: true, password, colors };
    }

    private getEnabledGroups(options: PasswordOptions): CharacterGroup[] {
        return (Object.keys(options) as (keyof PasswordOptions)[])
            .filter((key) => options[key])
            .map((key) => ({
                chars: CHARACTER_SETS[key],
                color: GROUP_COLORS[key],
            }));
    }
}
