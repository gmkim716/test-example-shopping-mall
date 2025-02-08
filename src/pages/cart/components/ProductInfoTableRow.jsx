import DeleteIcon from '@mui/icons-material/Delete';
import {
  TableCell,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import React from 'react';

import { MAX_CART_VALUE } from '@/constants';
import { cartValidationMessages } from '@/messages';
import { formatPrice } from '@/utils/formatter';

// 상품명, 가격과 같은 정보와 삭제, 수량 변경 필드를 렌더링하는 컴포넌트
// 각각의 상품을 대상으로 하기보다는, 테이블의 모든 상품을 대상으로 기능을 검증하는 것이 효율적입니다
const ProductInfoTableRow = ({
  item,
  user,
  removeCartItem,
  changeCartItemCount,
}) => {
  const { id, title, count, images, price } = item;

  const handleClickDeleteItem = itemId => () => {
    // 스파이 함수로 호출 여부만 검증이 가능합니다
    removeCartItem(itemId, user.id);
  };

  const handleChangeCount = itemId => ev => {
    const newCount = Number(ev.target.value);

    if (newCount > MAX_CART_VALUE) {
      alert(cartValidationMessages.MAX_INPUT_VALUE);
      return;
    }

    changeCartItemCount({ itemId, userId: user.id, count: newCount });
  };

  return (
    <TableRow>
      <TableCell sx={{ textAlign: 'center' }}>
        <img src={images[0]} height="80px" />
      </TableCell>
      <TableCell>{title}</TableCell>
      <TableCell>
        <TextField
          variant="standard"
          onChange={handleChangeCount(id)}
          defaultValue={count}
          size="small"
          sx={{ width: '10ch' }}
          InputProps={{
            endAdornment: <InputAdornment position="end">개</InputAdornment>,
          }}
        />
      </TableCell>
      <TableCell>{formatPrice(price * count)}</TableCell>
      <TableCell>
        <IconButton
          aria-label="delete button"
          size="small"
          onClick={handleClickDeleteItem(id)}
        >
          <DeleteIcon fontSize="inherit" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default ProductInfoTableRow;
