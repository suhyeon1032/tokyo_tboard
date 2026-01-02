import { Box, Button, Stack, Typography } from '@mui/material';


function PostFormImage({ imageName, onChangeImage, uploading }) {
    return (
        <Box>
            <Stack direction="row" alignContent='center' spacing={2} mb={1}>
                <Button variant='outlined' component="label" disabled={uploading}>
                    이미지 선택
                    {/* accept='image/**' : image안에 들어가는 파일은 다 허용하겠다 */}
                    {/* accept='.png, .jpg' : 특정 확장자 파일만 받겠다 */}
                    <input type='file' hidden accept='image/*' onChange={onChangeImage} />
                    {/* <input type='file' hidden accept='image/*' onChange={(evt) => onChangeImage(evt.target.files[0], evt)} /> */}
                </Button>

                {!uploading && imageName && (
                    <Typography variant="body2" color='#666'>
                        {imageName}
                    </Typography>
                )}

            </Stack>

        </Box>
    );
}

export default PostFormImage;