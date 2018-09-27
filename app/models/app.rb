class App < ApplicationRecord
  serialize :stages
  validates_presence_of :name

  has_many :builds
  has_many :releases, through: :builds

  subscribe(Apps::CreatedEvent) do |event|
    params = event.params

    App.create!(name: params[:name], uid: params[:id])
  end

  subscribe(Apps::DeletedEvent) do |event|
    params = event.params

    App.find_by!(uid: params[:id]).destroy!
  end

  subscribe(Apps::UpdatedEvent) do |event|
    params = event.params

    App.find_by!(uid: params[:id]).update!(stages: params[:stages])
  end
end
