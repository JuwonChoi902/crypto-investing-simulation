import React from 'react';
import styled from 'styled-components';
import user from '../images/user.png';

interface UserList {
  id: number;
  userId: string;
  rank: number;
  returnRate: number;
}

const UserList: UserList[] = [
  { id: 1, userId: 'goodjob123', rank: 1, returnRate: 145 },
  { id: 2, userId: 'rltjrWkdWkd', rank: 2, returnRate: 140 },
  { id: 3, userId: 'juwon123', rank: 3, returnRate: 135 },
  { id: 4, userId: 'nerdcloud09', rank: 4, returnRate: 130 },
  { id: 5, userId: 'icanwinthis123', rank: 5, returnRate: 125 },
  { id: 6, userId: 'hohoho', rank: 6, returnRate: 120 },
  { id: 7, userId: 'appleowner17', rank: 7, returnRate: 115 },
  { id: 8, userId: 'carsalerRich', rank: 8, returnRate: 110 },
  { id: 9, userId: 'youAneMe2233', rank: 9, returnRate: 105 },
  { id: 10, userId: 'yoonah95', rank: 10, returnRate: 100 },
];
export default function Ranking() {
  return (
    <OuterBox>
      <FilterTap>
        <Following>팔로잉</Following>
        <ShowRanks>랭킹</ShowRanks>
        <ShowMyRank>내랭킹</ShowMyRank>
      </FilterTap>
      <RankBox>
        {UserList.map((el) => (
          <Rank>
            <UserImg>
              <img src={user} alt='user' />
            </UserImg>
            <UserRank>{el.rank}위</UserRank>
            <UserNick>{el.userId}</UserNick>
            <UserRate>{el.returnRate}%</UserRate>
          </Rank>
        ))}
      </RankBox>
    </OuterBox>
  );
}

const OuterBox = styled.div`
  width: 200px;
  border-top: 2px solid black;
`;
const FilterTap = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: bold;
  padding: 10px 0px;
  border-bottom: 1px solid #e5e5e5;
`;
const Following = styled.div`
  margin-right: 10px;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowRanks = styled.div`
  margin-right: 10px;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const ShowMyRank = styled.div`
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const RankBox = styled.div`
  padding: 5px 0;
`;
const UserNick = styled.div`
  margin-right: 5px;
  &:hover {
    cursor: pointer;
  }
`;
const Rank = styled.div`
  display: flex;
  font-size: 14px;
  padding: 5px 0 5px 0;

  &:hover ${UserNick} {
    text-decoration: underline;
    color: ${(props) => props.theme.style.yellow};
  }
`;
const UserImg = styled.div`
  margin-right: 5px;
  img {
    width: 16px;
    opacity: 0.2;
  }
`;
const UserRank = styled.div`
  margin-right: 5px;
`;

const UserRate = styled.div`
  font-weight: bold;
`;
