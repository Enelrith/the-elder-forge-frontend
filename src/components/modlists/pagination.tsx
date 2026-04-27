import Link from 'next/link';
import type { Page } from '@/lib/page';

interface PaginationProps {
  page: Page;
  searchName: string;
}

function getBrowseHref(pageNumber: number, searchName: string) {
  const params = new URLSearchParams({ page: pageNumber.toString() });

  if (searchName) {
    params.set('name', searchName);
  }

  return `/modlists/browse?${params.toString()}`;
}

export default function Pagination({ page, searchName }: PaginationProps) {
  if (page.totalPages <= 1) {
    return null;
  }

  const hasPreviousPage = page.number > 0;
  const hasNextPage = page.number + 1 < page.totalPages;
  const pageNumbers = Array.from(
    { length: page.totalPages },
    (_, index) => index
  );

  return (
    <nav
      aria-label="Browse modlist pages"
      className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-stone-700 pt-5"
    >
      {hasPreviousPage ? (
        <Link
          href={getBrowseHref(page.number - 1, searchName)}
          className="btn-secondary"
        >
          Previous
        </Link>
      ) : (
        <span className="btn-disabled">Previous</span>
      )}

      {pageNumbers.map((number) =>
        number === page.number ? (
          <span key={number} aria-current="page" className="btn-primary">
            {number + 1}
          </span>
        ) : (
          <Link
            key={number}
            href={getBrowseHref(number, searchName)}
            className="btn-secondary"
          >
            {number + 1}
          </Link>
        )
      )}

      {hasNextPage ? (
        <Link
          href={getBrowseHref(page.number + 1, searchName)}
          className="btn-secondary"
        >
          Next
        </Link>
      ) : (
        <span className="btn-disabled">Next</span>
      )}
    </nav>
  );
}
