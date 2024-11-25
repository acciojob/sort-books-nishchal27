import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://openlibrary.org/search.json';

// Asynchronous thunk action to fetch books from the API based on a search query
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (query = 'javascript') => {
  const response = await axios.get(`${API_URL}?q=${query}`);
  return response.data.docs.map((book) => ({
    title: book.title,
    author: book.author_name ? book.author_name.join(', ') : 'Unknown',
    publisher: book.publisher ? book.publisher[0] : 'Unknown',
  }));
});

// Create a slice for books with initial state and reducers
const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [], // Array to store book data
    status: 'idle', // Status of the fetch operation ('idle', 'loading', 'succeeded', 'failed')
    error: null, // Error message if the fetch operation fails
    sortOrder: 'asc', // Default sort order
    sortField: 'title', // Default field to sort by
  },
  reducers: {
    // Reducer to set the sort order (ascending or descending)
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    // Reducer to set the field by which books are sorted (title, author, or publisher)
    setSortField(state, action) {
      state.sortField = action.payload;
    },
    // Reducer to sort books based on the current sort field and order
    sortBooks(state) {
      state.books.sort((a, b) => {
        const field = state.sortField;
        const order = state.sortOrder === 'asc' ? 1 : -1;
        return a[field].localeCompare(b[field]) * order;
      });
    },
  },
  extraReducers: (builder) => {
    builder
     // Handle the pending state of the fetchBooks thunk
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      // Handle the fulfilled state of the fetchBooks thunk
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      // Handle the rejected state of the fetchBooks thunk
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions for use in components
export const { setSortOrder, setSortField, sortBooks } = booksSlice.actions;
// Export the reducer to be used in the store
export default booksSlice.reducer;
