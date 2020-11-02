type Cell = string | number | undefined

export const cellToJAN = (cell: Cell) => (cell ?? "").toString().padStart(13, "0")

export const cellToInt = (cell: Cell) => typeof cell === "number" ? cell : (parseInt((cell ?? ""), 10) || 0)
