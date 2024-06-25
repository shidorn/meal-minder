import Link from "next/link";

interface Breadcrumb {
  title: string;
  href: string;
}

interface BreadcrumbsProps {
  crumbs: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  return (
    <nav className="text-sm font-medium text-gray-500">
      <ol className="flex">
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            <Link href={crumb.href} className="hover:text-gray-700">
              {crumb.title}
            </Link>
            {index < crumbs.length - 1 && (
              <svg
                className="w-3 h-3 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
