export const BlogSkeleton = () => {
    return (
        <div className="blog-container skeleton-animate">
            <div className="blog-user-container">
                <div className='buc-top'>
                    <div className="skeleton-box skeleton-author"></div>
                    <div className="skeleton-box skeleton-date"></div>
                </div>
                <div className='buc-likes'>
                    <div className="skeleton-box skeleton-icon"></div>
                    <div className="skeleton-box skeleton-likes-count"></div>
                </div>
            </div>
            <div className="skeleton-box skeleton-title"></div>
            <div className="skeleton-content">
                <div className="skeleton-box skeleton-line full-width"></div>
                <div className="skeleton-box skeleton-line partial-width-1"></div>
                <div className="skeleton-box skeleton-line partial-width-2"></div>
            </div>
        </div>
    );
};
