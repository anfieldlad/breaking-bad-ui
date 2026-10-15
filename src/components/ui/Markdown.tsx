import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Model output can contain links; open them safely in a new tab.
const components: Components = {
    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

/** Render untrusted model output as GitHub-flavored Markdown (raw HTML is not rendered). */
export const Markdown = ({ children, className = '' }: { children: string; className?: string }) => (
    <div className={`prose prose-invert max-w-none ${className}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {children}
        </ReactMarkdown>
    </div>
);
