import { Box, Paper, Typography } from '@mui/material'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import PostSearch from '../../components/posts/PostSearch';
import PostTable from '../../components/posts/PostTable';
import PostPagination from '../../components/posts/PostPagination';
import { useState } from 'react';
import { fetchPosts } from '../../api/postsApi';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useMe } from '../../hooks/useMe';

function PostList() {

    // 현재 페이지 상태
    const [page, setPage] = useState(0);
    // 키워드 상태
    const [keyword, setKeyword] = useState('');

    // 조회 Query
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['posts', page, keyword],
        queryFn: () => fetchPosts({ page, size: 10, keyword }),
        keePpreviousData: keepPreviousData // 페이지 전환 시 기존 데이터 유지. 화면에 빈 화면이 생기지 않음
    });

    const { data: me, isLoading: meIsLoading } = useMe();

    if (isLoading) return <div><Loader /></div>
    if (isError) return <div><ErrorMessage /></div>
    if (isError) return error?.message

    // 구조분해 Back > PageResponse파일에서 가져옴
    const { content, totalPages } = data;

    // 이벤트 핸들러 =======================
    // 검색
    const handleSearch = (evt) => {
        evt.preventDefault();
        setPage(0);
    }

    // 페이지 이동
    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0));
    }

    const handleNext = (evt) => {
        setPage((prev) => prev + 1 < totalPages ? prev + 1 : prev);
    }

    return (
        <Box sx={{ px: 2, py: 2 }}>
            <Paper elevation={0}
                sx={{
                    width: '100%',
                    borderRadius: 3,
                    p: 4,
                    boxShadow: '0 16px 45px rgba(0,0,0,0.06)' // x축, y축, 번짐, 색상(rgba의 a(alpha) : 투명도 0~1)
                }} >
                <Box>
                    {/* 상단 제목 */}
                    <Typography variant='h5' sx={{ fontWeight: 600, fontSize: 24 }}>게시글 제목</Typography>

                    {/* 검색 */}
                    <PostSearch
                        keyword={keyword}
                        onChangeKeyword={setKeyword}
                        onSubmit={handleSearch}
                    />

                    {/* 테이블 */}
                    <PostTable posts={content} />

                    {/* 페이지네이션 */}
                    <PostPagination
                        page={page}
                        totalPages={totalPages}
                        onPrev={handlePrev}
                        onNext={handleNext}
                        logined={!meIsLoading && !!me}
                    />
                </Box>
            </Paper>
        </Box>
    );
}

export default PostList;