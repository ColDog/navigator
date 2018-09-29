class App < ApplicationRecord
  serialize :stages
  validates_presence_of :name

  has_many :builds
  has_many :releases, through: :builds
  has_many :stages

  subscribe(Apps::CreatedEvent) do |event|
    create!(name: event.name, uid: event.app_uid)
  end

  subscribe(Apps::DeletedEvent) do |event|
    find_by_uid!(event.app_uid).destroy!
  end

  subscribe(Apps::UpdatedEvent) do |event|
    find_by_uid!(params[:app_id]).update!(name: event.name)
  end
end
