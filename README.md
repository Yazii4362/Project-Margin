# 📮 Project Margin

> **2026년 스승의 날, 마음을 전하는 특별한 방법**  
> 강현명 선생님께 드리는 학생들의 감사 편지 웹 경험

<div align="center">

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Made with Love](https://img.shields.io/badge/made%20with-❤️-red.svg)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)

[🎬 Live Demo](#) · [📖 Documentation](#features) · [👥 Team](#team)

</div>

---

## ✨ Overview

**Project Margin**은 2026년 스승의 날을 맞아 제작된 인터랙티브 웹 경험입니다. 학생들의 진심 어린 감사 메시지를 봉투를 열어보는 감성적인 인터페이스로 전달합니다.

### 🎯 Project Goals

- 📬 **감성적 경험**: 실제 편지를 열어보는 듯한 인터랙션
- 🎨 **세련된 디자인**: 모던하면서도 따뜻한 비주얼
- 📱 **반응형 지원**: 모든 디바이스에서 완벽한 경험
- ♿ **접근성**: WCAG 가이드라인 준수
- 🎵 **몰입감**: AI 생성 배경음악과 햅틱 피드백

---

## 🎨 Features

### 🏠 Hero Section
- 영화 같은 인트로 화면
- 봉투 애니메이션과 인터랙션
- 부드러운 페이지 전환

### 📬 Letter Carousel
- 13개의 학생 편지 카드
- 드래그/스와이프 네비게이션
- 카드 열기/닫기 애니메이션
- 읽음 표시 기능
- 진행률 트래킹

### 👥 Credits Section
- 팀 멤버 프로필 카드
- 개인 편지 모달
- 커피 후원 티켓 시스템
- 소셜 링크 통합

### 🎵 BGM Player
- AI 생성 배경음악 재생
- 플레이리스트 아코디언
- 우측 하단 플로팅 UI
- 볼륨 비주얼라이저

### 🎯 Navigation
- Apple HIG 스타일 하단 네비게이션
- 섹션별 스크롤 트리거
- 부드러운 스크롤 애니메이션

### 🔒 Progress Lock
- 모든 편지 읽기 전 팀 섹션 잠금
- 진행률 표시
- 세련된 모달 디자인

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - 모던 레이아웃 & 애니메이션
  - CSS Grid & Flexbox
  - CSS Variables (Design Tokens)
  - Backdrop Filter & Blur Effects
  - Custom Animations & Transitions
- **Vanilla JavaScript** - 순수 JS로 구현
- **GSAP** - 고급 애니메이션 & 스크롤 효과
  - ScrollTrigger
  - ScrollSmoother

### Design System
- **Typography**: 국립박물관문화재단클래식, OG Renaissance Secret
- **Color Palette**: Warm earth tones with red accents
- **Spacing**: 4px base unit system
- **Radius**: Consistent border radius tokens

### Performance
- **Preload** critical resources
- **Lazy loading** for images
- **Optimized** animations (GPU acceleration)
- **Responsive** images (WebP format)

---

## 📁 Project Structure

```
Project-Margin/
├── index.html                 # Main HTML file
├── README.md                  # This file
├── assets/
│   ├── css/
│   │   ├── reset.css         # CSS reset
│   │   ├── tokens.css        # Design tokens
│   │   ├── common.css        # Common styles & marquee
│   │   ├── splash.css        # Hero section
│   │   ├── envelope.css      # Envelope animation
│   │   ├── carousel.css      # Letter carousel
│   │   ├── credits.css       # Team credits
│   │   ├── credits-enhanced.css  # Enhanced card styles
│   │   ├── bgm-player.css    # Music player
│   │   ├── sticky-nav.css    # Navigation & modals
│   │   ├── margin-cursor.css # Custom cursor
│   │   ├── grain.css         # Texture effects
│   │   ├── loading.css       # Loading states
│   │   ├── accessibility.css # A11y improvements
│   │   ├── visual-effects.css # Visual enhancements
│   │   ├── hig-components.css # Apple HIG components
│   │   ├── hig-overrides.css # HIG customizations
│   │   └── responsive.css    # Media queries
│   ├── js/
│   │   ├── data.js           # Letter data
│   │   ├── splash.js         # Hero interactions
│   │   ├── envelope.js       # Envelope animation
│   │   ├── carousel.js       # Carousel logic
│   │   ├── credits.js        # Team section
│   │   ├── bgm-player.js     # Music player
│   │   ├── sticky-nav.js     # Navigation
│   │   ├── margin-cursor.js  # Custom cursor
│   │   ├── haptic-feedback.js # Haptic support
│   │   ├── accessibility.js  # A11y features
│   │   └── visual-effects.js # Visual effects
│   ├── images/               # Images & graphics
│   └── audio/                # Background music
└── .vscode/                  # VS Code settings
```

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Project-Margin.git
   cd Project-Margin
   ```

2. **Open in browser**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Or simply open index.html in your browser
   ```

3. **Visit**
   ```
   http://localhost:8000
   ```

---

## 🎨 Design Highlights

### Color System
```css
--color-bg:        #F8F9FA  /* Background */
--color-ink:       #1A1612  /* Primary text */
--color-red:       #FF5A45  /* Accent */
--color-red-soft:  #FF7A68  /* Accent light */
--color-cream:     #FDFAF4  /* Surface */
```

### Typography Scale
```css
--text-2xs:  10px
--text-xs:   12px
--text-sm:   14px
--text-md:   18px
--text-lg:   26px
--text-xl:   40px
--text-2xl:  62px
--text-3xl:  92px
```

### Animation Principles
- **Easing**: `cubic-bezier(0.22, 1, 0.36, 1)` for smooth, natural motion
- **Duration**: 180ms (fast), 420ms (normal), 680ms (slow)
- **GPU Acceleration**: `transform` and `opacity` for 60fps

---

## 👥 Team

### Team Margin

**임예지** - Lead · PM  
기획 · 디자인 · 개발 구현  
[GitHub](https://github.com/Yazii4362) · [Blog](https://yaziihome.tistory.com/)

**김주은** - FE · 디자인 · 기획  
디자인 · 기획 지원 + FE 하드코딩  
[GitHub](https://github.com/Jurmiii) · [Blog](https://jurmi.tistory.com/)

**신혜인** - 그래픽 · AI 음악  
피그마 그래픽 + AI 음악 제작  
[GitHub](https://github.com/shinini524)

**윤태경** - FE  
JS 이스터에그 게임 구현  
[GitHub](https://github.com/arcaniac7303)

**Special Thanks**  
이기훈 - 📣 Cheerleader

---

## 🎯 Key Features Implementation

### 1. Envelope Animation
```javascript
// Smooth envelope opening with GSAP
gsap.to('.envelope-flap', {
  rotateX: -180,
  duration: 0.8,
  ease: 'power2.inOut'
});
```

### 2. Carousel Navigation
- Drag & swipe support
- Keyboard navigation (←/→)
- Scroll-based navigation
- Touch-friendly on mobile

### 3. Progress Tracking
- LocalStorage persistence
- Real-time progress updates
- Unlock mechanism for team section

### 4. Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 900px, 1200px
- Touch-optimized interactions
- Safe area insets for notched devices

---

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | ≥ 90    |
| Firefox | ≥ 88    |
| Safari  | ≥ 14    |
| Edge    | ≥ 90    |

---

## ♿ Accessibility

- ✅ Semantic HTML5
- ✅ ARIA labels and roles
- ✅ Keyboard navigation
- ✅ Focus management
- ✅ Screen reader support
- ✅ Reduced motion support
- ✅ Color contrast (WCAG AA)

---

## 📄 License

This project is created for educational purposes as a Teacher's Day gift.  
© 2026 Team Margin. All rights reserved.

---

## 🙏 Acknowledgments

- **강현명 선생님** - 프로젝트의 영감
- **Google Fonts** - Typography
- **GSAP** - Animation library
- **Codicon** - Icon system
- **AI Music Generation** - Background music

---

## 📞 Contact

Questions or feedback? Reach out to Team Margin!

- 📧 Email: [team@margin.com](mailto:team@margin.com)
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/Project-Margin/issues)

---

<div align="center">

**Made with ❤️ by Team Margin**

*"좋은 스승을 만난 건 오래 기억에 남을 행운인 것 같아요"*

[⬆ Back to Top](#-project-margin)

</div>