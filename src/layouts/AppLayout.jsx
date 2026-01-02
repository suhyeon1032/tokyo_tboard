// header + menu + Outlet
import { Link, Outlet, useNavigate } from 'react-router'
import { AppBar, Box, Toolbar, Typography, Container, Stack, Button } from '@mui/material'
import { LuRabbit } from "react-icons/lu";
import { useQueryClient } from '@tanstack/react-query';
import { useMe } from '../hooks/useMe';
import { clearAuth } from '../api/authApi';

function AppLayout() {
    const queryClient = useQueryClient();
    const { data: me, isLoading: meIsLoding } = useMe();
    const navigate = useNavigate();

    // 로그아웃 이벤트 핸들러
    const handleLogout = () => {
        clearAuth(); // 토큰 지우기
        queryClient.setQueryData(["me"], null); // 즉시 업데이트
        navigate("/posts");
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#e5eaffff' }}>
            {/* color='transparent' : 투명 */}
            <AppBar position='fixed' sx={{ bgcolor: '#5c6fceff' }}>
                <Container maxWidth='md'>
                    {/* 로고 */}
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box component={Link} to="/posts" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#f5f7ffff' }}>
                            {/* font-icon */}
                            <Box sx={{
                                width: 40, height: 40,
                                borderRadius: '50%', // 둥근 모서리
                                bgcolor: '#fff',
                                display: 'grid', // 바둑판 형태의 레이아웃 스타일
                                placeItems: 'center', // grid일 때만 적용 가능한 x,y 중앙 정렬
                                mr: 1.5
                            }}>
                                <LuRabbit style={{ color: '#6876b9ff', fontSize: 20 }} />
                            </Box>
                            {/* fontWeight: 700  = 서체 스타일 */}
                            <Typography variant='h6' component="h1" sx={{ fontWeight: 700 }}>
                                게시판
                            </Typography>
                        </Box>
                        {/* 회원가입 / 로그인 */}
                        <Stack direction="row" spacing={1.5} alignItems="center">
                            {!meIsLoding && me ? (
                                <Button variant='text' sx={{ color: '#fff' }} onClick={handleLogout}>로그아웃</Button>
                            ) : (
                                <>
                                    <Button component={Link} to="/auth/login" variant='text' sx={{ color: "#fff" }}>로그인</Button>
                                    <Button component={Link} to="/auth/register" variant='text' sx={{ color: "#fff" }}>회원가입</Button>
                                </>
                            )
                            }
                        </Stack>
                    </Toolbar>
                </Container>

            </AppBar>
            {/* <header>헤더</header> */}
            <Container maxWidth='md' component="main" sx={{ pt: 10, mb: 4 }}>
                <Outlet />
            </Container>
        </Box >
    );
}

export default AppLayout;