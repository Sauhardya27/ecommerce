'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface Interest {
	_id: string;
	id: number;
	name: string;
	selected: boolean;
}

interface PaginationData {
	total: number;
	totalPages: number;
	currentPage: number;
	pageSize: number;
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
	const maxVisible = 7;
	const pages: (number | string)[] = [];

	if (totalPages <= maxVisible) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	pages.push(1);

	if (currentPage > 3) {
		pages.push('...');
	}

	let start = Math.max(2, currentPage - 2);
	let end = Math.min(totalPages - 1, currentPage + 2);

	if (currentPage <= 3) {
		end = Math.min(maxVisible - 1, totalPages - 1);
	}
	if (currentPage >= totalPages - 2) {
		start = Math.max(2, totalPages - (maxVisible - 2));
	}

	for (let i = start; i <= end; i++) {
		pages.push(i);
	}

	if (currentPage < totalPages - 3) {
		pages.push('...');
	}
	if (totalPages > 1) {
		pages.push(totalPages);
	}

	return pages;
};

export default function Interests() {
	const [interests, setInterests] = useState<Interest[]>([]);
	const [pagination, setPagination] = useState<PaginationData>({
		total: 0,
		totalPages: 0,
		currentPage: 1,
		pageSize: 6,
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const router = useRouter();
	const searchParams = useSearchParams();
	const currentPage = parseInt(searchParams.get('page') || '1');

	const fetchInterests = async (page: number) => {
		try {
			setLoading(true);
			setError(null);
			const res = await fetch(`/api/interests?page=${page}&pageSize=${pagination.pageSize}`);

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}

			const data = await res.json();
			setInterests(data.interests);
			setPagination(data.pagination);
		} catch (error) {
			console.error('Failed to fetch interests:', error);
			setError('Failed to load interests. Please try again later.');
		} finally {
			setLoading(false);
		}
	};

	const handleSelectionChange = async (id: number, selected: boolean) => {
		try {
			const res = await fetch('/api/interests', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id, selected }),
			});

			if (!res.ok) {
				throw new Error('Failed to update');
			}

			const updatedInterest = await res.json();
			setInterests(interests.map(interest =>
				interest.id === id ? updatedInterest : interest
			));
		} catch (error) {
			console.error('Failed to update interest:', error);
			setInterests(interests.map(interest =>
				interest.id === id ? { ...interest, selected: !selected } : interest
			));
		}
	};

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		router.push(`/interests?${params.toString()}`);
	};

	useEffect(() => {
		fetchInterests(currentPage);
	}, [currentPage, pagination.pageSize]);

	return (
		<div className="max-w-[400px] mx-auto bg-white rounded-xl p-8 border border-gray-300">
			<h2 className="text-[22px] font-medium text-center mb-1">
				Please mark your interests!
			</h2>
			<p className="text-[13px] text-black text-center mb-8">
				We will keep you notified.
			</p>

			<hr className="border-t border-gray-300 -mt-8 mb-4"/>

			<div className="mb-6">
				<div className="bg-white py-[6px] mb-4 rounded">
					<span className="text-sm font-medium">My saved interests!</span>
				</div>

				{loading ? (
					<div className="flex justify-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
					</div>
				) : (
					<div className="space-y-4">
						{interests.map((interest) => (
							<label
								key={interest.id}
								className="flex items-center space-x-3 cursor-pointer">
								<div className="relative flex items-center">
									<input
										type="checkbox"
										checked={interest.selected}
										onChange={() => handleSelectionChange(interest.id, !interest.selected)}
										className="w-5 h-5 border border-gray-300 rounded appearance-none cursor-pointer bg-gray-300 checked:bg-black checked:border-black"
									/>
									{interest.selected && (
										<svg
											className="absolute left-[3px] top-[3px] w-[14px] h-[14px] text-white pointer-events-none"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M13.3334 4L6.00008 11.3333L2.66675 8"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									)}
								</div>
								<span className="text-[15px] text-gray-800">
									{interest.name}
								</span>
							</label>
						))}
					</div>
				)}
			</div>

			{pagination.totalPages > 1 && (
				<div className="flex justify-center items-center space-x-1 text-sm">
					<button
						onClick={() => handlePageChange(1)}
						disabled={currentPage === 1}
						className="px-1 py-1 text-gray-400 hover:text-gray-600">
						{'<<'}
					</button>
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className="px-1 py-1 text-gray-400 hover:text-gray-600 disabled:text-gray-200">
						{'<'}
					</button>

					{getPageNumbers(currentPage, pagination.totalPages).map((page, index) => (
						page === '...' ? (
							<span key={`ellipsis-${index}`} className="w-6 h-6 flex items-center justify-center text-gray-400">
								...
							</span>
						) : (
							<button
								key={page}
								onClick={() => handlePageChange(page as number)}
								className={`w-6 h-6 flex items-center justify-center rounded ${
									currentPage === page
										? 'text-black font-semibold'
										: 'text-gray-400 hover:text-gray-600'
								}`}>
								{page}
							</button>
						)
					))}

					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === pagination.totalPages}
						className="px-1 py-1 text-gray-400 hover:text-gray-600 disabled:text-gray-200">
						{'>'}
					</button>
					<button
						onClick={() => handlePageChange(pagination.totalPages)}
						disabled={currentPage === pagination.totalPages}
						className="px-1 py-1 text-gray-400 hover:text-gray-600 disabled:text-gray-200">
						{'>>'}
					</button>
				</div>
			)}
		</div>
	);
}