// Main Tailwind CSS classes for user pages
const tailwindCSS = {

    pageWrap: "mx-4 mt-8",

    h1: "text-4xl",
    h2: "text-2xl font-bold",

    card: "border p-4 rounded-lg",
    cardSoft: "border rounded-lg p-6",

    input: "border rounded-lg px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-[#007E6E]/40",

    btnPrimary: "cursor-pointer text-lg px-4 py-2 bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg hover:opacity-90 transition-all",
    btnSmallPrimary: "cursor-pointer bg-gradient-to-b from-[#73AF6F] to-[#007E6E] text-white rounded-lg px-3 py-1 hover:opacity-90 transition-all",

    btnSecondary: "cursor-pointer border rounded-lg px-3 py-2 hover:opacity-80 transition-all",
    btnDanger: "cursor-pointer border border-red-500 text-red-500 rounded-lg px-3 py-1 hover:opacity-80 transition-all",

    link: "underline hover:opacity-80",

    alertError: "border border-red-500 text-red-600 bg-red-50 rounded-lg px-3 py-2 text-sm",
    alertSuccess: "border border-green-500 text-green-700 bg-green-50 rounded-lg px-3 py-2 text-sm"
};

export default tailwindCSS;