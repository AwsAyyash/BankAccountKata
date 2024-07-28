import React from 'react';
import { DefaultButton, IconButton, Stack, Text } from '@fluentui/react';
import { conditinoalyRender } from '../utils/reactUtils/reactUtils';

interface PaginationProps {
    pageCount: number;
    selectedPageIndex: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    pageCount,
    selectedPageIndex,
    onPageChange,
}) => {
    const handleFirstPage = () => onPageChange(0);
    const handleLastPage = () => onPageChange(pageCount - 1);
    const handlePreviousPage = () => {
        if (selectedPageIndex > 0) {
            onPageChange(selectedPageIndex - 1);
        }
    };
    const handleNextPage = () => {
        if (selectedPageIndex < pageCount - 1) {
            onPageChange(selectedPageIndex + 1);
        }
    };

    return (
        <Stack horizontal tokens={{ childrenGap: 5 }} verticalAlign="center">
            <IconButton
                iconProps={{ iconName: 'DoubleChevronLeft' }}
                title="First Page"
                ariaLabel="First Page"
                onClick={handleFirstPage}
                disabled={selectedPageIndex === 0}
            />
            {conditinoalyRender(
                pageCount > 1,
                <DefaultButton text='1' title='page 1' onClick={() => onPageChange(0)} style={{ width: "fit-content", minWidth: "unset" }} />

            )}
            <IconButton
                iconProps={{ iconName: 'ChevronLeft' }}
                title="Previous page"
                ariaLabel="Previous page"
                onClick={handlePreviousPage}
                disabled={selectedPageIndex === 0}
            />
            <span>Page {selectedPageIndex + 1} of {pageCount}</span>
            <IconButton
                iconProps={{ iconName: 'ChevronRight' }}
                title="Next page"
                ariaLabel="Next page"
                onClick={handleNextPage}
                disabled={selectedPageIndex === pageCount - 1}
            />
            {conditinoalyRender(
                pageCount > 1,
                <DefaultButton text={`${pageCount}`} title={`Page ${pageCount}`} onClick={() => onPageChange(pageCount - 1)} style={{ width: "fit-content", minWidth: "unset" }} />
            )}
            <IconButton
                iconProps={{ iconName: 'DoubleChevronRight' }}
                title="Last Page"
                ariaLabel="Last Page"
                onClick={handleLastPage}
                disabled={selectedPageIndex === pageCount - 1}
            />
            <Text>
                {selectedPageIndex > 1 && (
                    <>
                        <IconButton
                            text="1"
                            onClick={handleFirstPage}
                        />
                        ...
                    </>
                )}
                {selectedPageIndex < pageCount - 2 && (
                    <>
                        ...
                        <IconButton
                            text={pageCount.toString()}
                            onClick={handleLastPage}
                        />
                    </>
                )}
            </Text>
        </Stack>
    );
};

export default Pagination;
