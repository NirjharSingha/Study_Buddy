import Link from "next/link";
import styles from "./explore.module.css"; // Assuming styles are imported from a CSS module

const subjects = [
  {
    name: "Math",
    description:
      "Master mathematical concepts from algebra to calculus with engaging courses.",
  },
  {
    name: "Physics",
    description:
      "Dive into the laws of the universe, from mechanics to quantum physics.",
  },
  {
    name: "Chemistry",
    description:
      "Discover the world of molecules, reactions, and chemical principles.",
  },
];

export default function SubjectsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Explore Our Subjects</h2>
        <div className={styles.grid}>
          {subjects.map((subject, index) => (
            <div
              key={subject.name}
              className={styles.subjectCard}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <h3 className={styles.subjectTitle}>{subject.name}</h3>
              <p className={styles.subjectDescription}>{subject.description}</p>
              <Link
                href={`/resources/${subject.name}`}
                className={styles.courseLink}
              >
                View Resources →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
