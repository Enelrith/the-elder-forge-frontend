import Link from 'next/link';

interface ModlistSearchFormProps {
  searchName: string;
}

export default function ModlistSearchForm({
  searchName,
}: ModlistSearchFormProps) {
  return (
    <form
      action="/modlists/browse"
      method="get"
      className="flex flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="name" className="sr-only">
        Search modlists by name
      </label>
      <input type="hidden" name="page" value="0" />
      <input
        id="name"
        name="name"
        type="search"
        defaultValue={searchName}
        placeholder="Search by modlist name"
        className="field-input min-w-0 flex-1"
      />
      <div className="flex gap-2">
        <button type="submit" className="btn-primary">
          Search
        </button>
        {searchName && (
          <Link href="/modlists/browse" className="btn-secondary">
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
