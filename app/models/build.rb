class Build < ApplicationRecord
  belongs_to :app
  has_many  :releases
  serialize :values
  validates_presence_of :stage, :version

  subscribe(Builds::CreatedEvent) do |event|
    params = event.params

    Build.create!(
      uid: params[:id],
      app: App.find_by!(name: params[:name]),
      stage: params[:stage],
      version: params[:version],
      values: params[:values],
    )
  end
end
