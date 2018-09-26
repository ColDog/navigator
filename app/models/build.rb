class Build < ApplicationRecord
  self.primary_key = "id"
  belongs_to :app
  serialize :values
  validates_presence_of :stage, :version

  subscribe(Builds::CreatedEvent) do |event|
    params = event.params

    Build.create!(
      id: params[:id],
      app: App.find_by!(name: params[:name]),
      stage: params[:stage],
      version: params[:version],
      values: params[:values],
    )
  end
end
