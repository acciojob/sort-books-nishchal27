import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://openlibrary.org/search.json';

// Fetch books
export const fetchBooks = createAsyncThunk('books/fetchBooks', async (query = 'javascript') => {
  const response = await axios.get(`${API_URL}?q=${query}`);
  return response.data.docs.map((book) => ({
    title: book.title,
    author: book.author_name ? book.author_name.join(', ') : 'Unknown',
    publisher: book.publisher ? book.publisher[0] : 'Unknown',
  }));
});

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    status: 'idle',
    error: null,
    sortOrder: 'asc',
    sortField: 'title',
  },
  reducers: {
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    setSortField(state, action) {
      state.sortField = action.payload;
    },
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
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setSortOrder, setSortField, sortBooks } = booksSlice.actions;
export default booksSlice.reducer;
