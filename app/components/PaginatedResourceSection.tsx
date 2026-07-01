import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <div className="flex justify-center mt-12 mb-8">
              <PreviousLink className="bg-primary text-white px-8 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-all cursor-pointer">
                {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
              </PreviousLink>
            </div>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <div className="flex justify-center mt-12 mb-8">
              <NextLink className="bg-primary text-white px-8 py-3 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-secondary transition-all cursor-pointer">
                {isLoading ? 'Loading...' : <span>Load more ↓</span>}
              </NextLink>
            </div>
          </div>
        );
      }}
    </Pagination>
  );
}
