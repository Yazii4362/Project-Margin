const CARDS_DATA = [
  // ── 학생 카드 1~13 ──────────────────────────
  // name     : 학생 이름
  // shape    : oval | rect | heart | circle
  // bgImage  : 카드 배경 이미지 경로
  // message  : 선생님께 전하는 메시지
  {
    id: 1,
    type: 'student',
    name: "이름1",
    shape: "oval",
    bgImage: "assets/images/cards/card-01.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 2,
    type: 'student',
    name: "이름2",
    shape: "rect",
    bgImage: "assets/images/cards/card-02.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 3,
    type: 'student',
    name: "이름3",
    shape: "oval",
    bgImage: "assets/images/cards/card-03.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 4,
    type: 'student',
    name: "이름4",
    shape: "rect",
    bgImage: "assets/images/cards/card-04.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 5,
    type: 'student',
    name: "이름5",
    shape: "oval",
    bgImage: "assets/images/cards/card-05.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 6,
    type: 'student',
    name: "이름6",
    shape: "heart",
    bgImage: "assets/images/cards/card-06.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 7,
    type: 'student',
    name: "이름7",
    shape: "rect",
    bgImage: "assets/images/cards/card-07.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 8,
    type: 'student',
    name: "이름8",
    shape: "oval",
    bgImage: "assets/images/cards/card-08.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 9,
    type: 'student',
    name: "이름9",
    shape: "rect",
    bgImage: "assets/images/cards/card-09.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 10,
    type: 'student',
    name: "이름10",
    shape: "heart",
    bgImage: "assets/images/cards/card-10.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 11,
    type: 'student',
    name: "이름11",
    shape: "oval",
    bgImage: "assets/images/cards/card-11.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 12,
    type: 'student',
    name: "이름12",
    shape: "rect",
    bgImage: "assets/images/cards/card-12.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },
  {
    id: 13,
    type: 'student',
    name: "이름13",
    shape: "oval",
    bgImage: "assets/images/cards/card-13.jpg",
    message: "선생님께 전하고 싶은 메시지를 여기에 작성해주세요."
  },

  // ── 14번째 카드: 만든이들 (special) ──────────
  // type 'special' → .card--special 클래스 부여 → 그린 포인트 스타일
  {
    id: 14,
    type: 'special',
    name: "만든이들",
    shape: "rect",
    bgImage: "assets/images/cards/card-special.jpg",
    message: "선생님, 저희가 함께 만든 작은 선물이에요.\n항상 감사합니다.",
    link: "https://example.com"
  }
];
