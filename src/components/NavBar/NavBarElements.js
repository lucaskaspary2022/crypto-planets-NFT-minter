import styled from 'styled-components';

export const Nav = styled.nav`
    background: ${({scrollNav}) => (scrollNav ? 'black' : '#11121e')};
    display: flex;
    justify-content: space-between;
    padding: 20px 80px 10px 80px;
`