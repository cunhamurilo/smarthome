import { ReactNode } from 'react';
import "./styles.scss"

type CardProps = {
    city?: string;
    name: string;
    roomHint?: string;
    traits: Record<string, {
      output: string;
    }>
    type: string;
    children?: ReactNode;
  }
  
export function Card({
    city,
    name,
    roomHint,
    traits,
    type,
    children,
}: CardProps) {
    return (
        <div className="card-content">
            <div className="user-info">
              {name}
            </div>
            <div>
              {children}
            </div>
        </div>
      );
}