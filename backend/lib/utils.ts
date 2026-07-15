// Minimal classNames helper to avoid frontend-only deps
export function cn(...inputs: Array<string | false | null | undefined>) {
    return inputs.filter(Boolean).join(' ')
}


