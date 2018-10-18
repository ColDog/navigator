class AppsController < ApplicationController

  def index
    render json: { data: App.all.map { |app| { id: app.uid, name: app.name } } }
  end

  def show
    app = App.find_by_name!(params[:app])
    render json: AppSerializer.serialize(app)
  end

  def create
    AppClient.create(app_params)
    head :created
  end

  def destroy
    app = App.find_by_name!(params[:app])
    Apps::DeleteCommand.execute(app_uid: app.uid)
    head :created
  end

  private
  def app_params
    params.permit!.to_h
  end

end
