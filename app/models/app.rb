class App < ApplicationRecord
  self.primary_key = "id"

  serialize :stages
  validates_presence_of :name

  subscribe(Apps::CreatedEvent) do |event|
    params = event.params

    App.create!(name: params[:name], id: params[:id])
  end

  subscribe(Apps::DeletedEvent) do |event|
    params = event.params

    App.find(params[:id]).destroy!
  end

  subscribe(Apps::UpdatedEvent) do |event|
    params = event.params

    App.find(params[:id]).update(stages: params[:stages])
  end
end
