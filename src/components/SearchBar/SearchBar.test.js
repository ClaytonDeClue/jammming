import { render, fireEvent, screen } from "@testing-library/react";
import SearchBar from "./SearchBar";

test("should search for a song when input is provided and search is triggered", () => {
  const onSearch = jest.fn(); // Mock search function
  render(<SearchBar onSearch={onSearch} />);

  const input = screen.getByPlaceholderText(
    "Search for a song, album, or artist"
  );

  fireEvent.change(input, { target: { value: "Song Title" } });
  fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

  expect(onSearch).toHaveBeenCalledWith("Song Title");
});
