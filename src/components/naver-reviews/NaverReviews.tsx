import snapshot from '@/content/naver-reviews.json';
import styles from './NaverReviews.module.css';

const avatarColors = [
  '#947c71', '#667f87', '#77826b', '#a28c9c',
  '#8b76aa', '#6879a3', '#8a927a', '#a08070',
];

const formatDate = (date: string) => date.replaceAll('-', '.');

export default function NaverReviews() {
  const visibleReviews = snapshot.reviews.slice(0, 8);

  return (
    <section id="naver-reviews" className={styles.reviews} aria-label="뉴리즈의원 인천 병원 방문 후기">
      <p className={styles.brand}>PRAVEIL CLINIC</p>
      <header className={styles.summary}>
        <div>
          <h2 className={styles.title}>
            <span className={styles.naver}>NAVER</span> 방문자 리뷰
          </h2>
          <p className={styles.sourceName}>
            {snapshot.placeNameAtCapture} 방문 후기{' '}
            <span className={styles.changeNote}>· 명칭 변경 전 방문 후기</span>
          </p>
          <div className={styles.countRow}>
            <span className={styles.count}>
              {snapshot.visitorReviewListCount.toLocaleString('ko-KR')}건{' '}
              <span className={styles.countLabel}>방문자 리뷰</span>
            </span>
            <span className={styles.capture}>{formatDate(snapshot.capturedOn)} 기준</span>
          </div>
        </div>
        <a className={styles.cta} href={snapshot.sourceUrl} target="_blank" rel="noopener noreferrer">
          네이버 리뷰 보기 <span className={styles.arrow} aria-hidden="true" />
        </a>
      </header>

      <div className={styles.grid}>
        {visibleReviews.map((review, index) => (
          <article key={review.id} className={styles.card}>
            <div className={styles.profile}>
              <span
                className={styles.avatar}
                style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
                aria-hidden="true"
              >
                {(Array.from(review.author)[0] ?? 'N').toUpperCase()}
              </span>
              <div>
                <h3 className={styles.author}>{review.author}</h3>
                <p className={styles.visitDate}>방문일 {formatDate(review.visitDate)}</p>
              </div>
            </div>
            <p className={styles.reviewLabel}>
              <span className={styles.nMark} aria-hidden="true">N</span> 방문자 리뷰
            </p>
            <p className={styles.excerpt}>{review.excerpt}{review.hasMore ? '…' : ''}</p>
            <a
              className={styles.more}
              href={review.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${review.author} 후기 · 네이버 전체 방문자 리뷰 페이지에서 더 보기 (새 탭)`}
            >
              네이버에서 더 보기 <span className={styles.arrow} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>

      <p className={styles.footnote}>
        출처: 네이버 플레이스 · {snapshot.placeNameAtCapture} 방문 후기 {visibleReviews.length}건 일부 발췌
      </p>
    </section>
  );
}
