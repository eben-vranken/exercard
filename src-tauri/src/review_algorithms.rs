use tauri::command;

#[derive(Debug, serde::Deserialize, serde::Serialize)]pub struct Card {
    id: u32,
    deck_id: u32,
    front: String,
    back: String,
    retrievability: f64,
    stability: f64,
    difficulty: f64,
    repetition: u32,
    easiness_factor: f64,
    interval: u32,
    grade: u32,
    next_review: i64,
}

#[command]
pub fn review_sm2(card: Card, grade: u8) -> Card {
    let mut new_card = card;
        
    if(grade >= 3) {
        if(new_card.repetition == 0) {
            new_card.interval = 1;
        } else if (new_card.repetition == 1) {
            new_card.interval = 6;
        } else {
            new_card.interval = (new_card.interval as f64 * new_card.easiness_factor).round() as u32;
        }
        new_card.repetition += 1;
    } else {
        new_card.repetition = 0;
        new_card.interval = 1;
    }
    
    new_card.easiness_factor = new_card.easiness_factor + (0.1 - (5.0 - grade as f64) * (0.08 + (5.0 - grade as f64) * 0.02));
    if(new_card.easiness_factor < 1.3) {
        new_card.easiness_factor = 1.3;
    }

    new_card.grade = grade as u32;
    new_card.next_review = chrono::Utc::now().timestamp() + new_card.interval as i64 * 24 * 60 * 60;
    new_card
}

#[command]
pub fn review_fsrs(card: Card, grade: u8) -> String {
    format!("Reviewed card {} with FSRS and grade {}", card.id, grade)
}