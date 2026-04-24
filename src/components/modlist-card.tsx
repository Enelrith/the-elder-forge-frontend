import { ModlistInfo } from '@/types/modlists';

export default function ModlistCard({
  modlistInfo,
}: {
  modlistInfo: ModlistInfo;
}) {
  return (
    <li className="flex flex-col rounded-sm bg-gray-700 p-2">
      <h3>{modlistInfo.name}</h3>
      <div>
        <p>{modlistInfo.createdAt}</p>
        <p>{modlistInfo.isPublic ? 'Public' : 'Private'}</p>
      </div>
    </li>
  );
}
