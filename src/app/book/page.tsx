"use client";
import {useEffect, useState} from 'react';
import type {Book} from '@/src/types/book';

export default function Page() {
	const [books, setBooks] = useState<Book[]>([]);

	useEffect(() => {
		(async () => {
			const response = await fetch('/api/books');
			const data = await response.json();
			setBooks(data);
		})();
	}, []);

	return (
		<>
			<h1>本のリスト</h1>
			<ul>
				{books.map((book, index) => (
					<li key={index}>
						{book.title} ({book.author})
					</li>
				))}
			</ul>
		</>
	)
}