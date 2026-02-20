/** @format */

export default function ChatInput({ setInput, handleSubmit, input, status }) {
  return (
    <form className="flex space-x-2" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={status !== "ready"}
        placeholder="Say something..."
        className="flex-1 p-2 rounded border border-gray-600 bg-black text-white outline-none"
      />
      <button
        type="submit"
        disabled={status !== "ready" || !input.trim()}
        className={`px-4 py-2 rounded ${
          status !== "ready" || !input.trim()
            ? "bg-gray-700 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        Send
      </button>
    </form>
  );
}
