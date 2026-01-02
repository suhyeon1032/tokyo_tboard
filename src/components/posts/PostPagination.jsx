import React from 'react';
import { Button, Stack, Typography } from '@mui/material'
import { Link } from 'react-router';

function PostPagination({ page, totalPages, onPrev, onNext, logined }) {
    return (
        // justifyContent='space-between' : 양 끝으로 정렬
        <Stack direction='row' justifyContent='space-between'
            alignItems='center' sx={{ mt: 3 }}>
            {/* 페이지네이션 */}
            {/* direction='row' : 주축의 방향을 가로로 변경 */}
            {/* alignItems={} : 교차축에서 정렬(위 아래) */}
            {/* justifyItems={} : 주축을 정해서 정렬 */}
            <Stack direction='row' alignItems='center' spacing={1.8}>
                <Button variant='outlined' size='small'
                    disabled={page === 0}
                    onClick={onPrev}
                >이전</Button>
                <Typography>
                    {page + 1} / {totalPages}
                </Typography>
                <Button variant='outlined' size='small'
                    disabled={page + 1 >= totalPages}
                    onClick={onNext}
                >다음</Button>
            </Stack>


            {/* 새 글 작성 버튼 */}
            {
                logined && (
                    <Button component={Link} to='/posts/new' variant='contained' size='small' sx={{ borderRadius: 999, px: 3, fontWeight: 500 }}>새 글 작성</Button>
                )
            }
        </Stack>
    );
}

export default PostPagination;