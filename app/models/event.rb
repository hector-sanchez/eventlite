class Event < ApplicationRecord
  validates_presence_of :title, :location, :start_datetime
  validates :title, length: { minimum: 3 }
  validate :start_datetime_cannot_be_in_past


  private

    def start_datetime_cannot_be_in_past
      if start_datetime.present? && start_datetime < Time.now
        errors.add :start_datetime, "can't be in the past"
      end
    end
end
