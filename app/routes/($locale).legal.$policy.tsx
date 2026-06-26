import { useLoaderData } from 'react-router';
import { marked } from 'marked';
import type { Route } from './+types/legal.$policy';

// Load all markdown files from the Legal pages directory at build time
const policyFiles = import.meta.glob('../../Legal pages/*.md', { query: '?raw', import: 'default', eager: true });

const POLICY_MAP: Record<string, string> = {
  'using-our-website': '../../Legal pages/Using Our Website.md',
  'terms-and-conditions': '../../Legal pages/Terms and Conditions.md',
  'privacy': '../../Legal pages/Privacy.md',
  'cookies': '../../Legal pages/Cookies.md',
  'refund-and-returns': '../../Legal pages/Refund and Returns.md',
  'shipping-and-delivery': '../../Legal pages/Shipping and Delivery.md',
};

const POLICY_TITLE_MAP: Record<string, string> = {
  'using-our-website': 'Using Our Website',
  'terms-and-conditions': 'Terms and Conditions',
  'privacy': 'Privacy Policy',
  'cookies': 'Cookie Policy',
  'refund-and-returns': 'Refund and Returns',
  'shipping-and-delivery': 'Shipping and Delivery',
};

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: `${data?.title || 'Legal'} | ShowerHaus` }];
};

export async function loader({ params }: Route.LoaderArgs) {
  const policyHandle = params.policy;
  
  if (!policyHandle || !POLICY_MAP[policyHandle]) {
    throw new Response('Policy Not Found', { status: 404 });
  }

  const fileKey = POLICY_MAP[policyHandle];
  const markdownContent = policyFiles[fileKey] as string;
  
  if (!markdownContent) {
    throw new Response('Policy Content Not Found', { status: 404 });
  }

  // Convert markdown to HTML asynchronously
  const htmlContent = await marked.parse(markdownContent);
  const title = POLICY_TITLE_MAP[policyHandle];

  return { htmlContent, title };
}

export default function LegalPolicy() {
  const { htmlContent, title } = useLoaderData<typeof loader>();

  return (
    <div className="animation-fade-in">
      <h2 className="font-display text-3xl text-primary mb-8 border-b border-gray-100 pb-4">
        {title}
      </h2>
      <div 
        className="article prose prose-sm md:prose-base max-w-none prose-headings:font-display prose-headings:text-primary prose-p:font-sans prose-p:font-light prose-p:text-gray-600 prose-a:text-secondary prose-a:no-underline hover:prose-a:underline"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  );
}
