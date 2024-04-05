export function generateSlug(text: String): string {
    return text.
    normalize("NFD") // Ele transforma uma um caractere especial em dois Ex: "é" => "e´"
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}