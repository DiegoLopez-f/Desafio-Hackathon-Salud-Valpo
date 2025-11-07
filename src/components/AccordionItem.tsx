"use client";
import { useState, ReactNode } from "react";
import styles from "./AccordionItem.module.css";

interface Props {
  title: string;
  children: ReactNode;
}

export default function AccordionItem({ title, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // Clases CSS dinámicas
  const contentClasses = `${styles.content} ${
    isOpen ? styles.contentOpen : ""
  }`;
  const iconClasses = `${styles.icon} ${isOpen ? styles.iconOpen : ""}`;

  return (
    <div className={styles.wrapper}>
      <button className={styles.header} onClick={() => setIsOpen(!isOpen)}>
        <span className={styles.title}>{title}</span>
        <div className={iconClasses}></div>
      </button>

      <div className={contentClasses}>
        <div className={styles.contentInner}>{children}</div>
      </div>
    </div>
  );
}
