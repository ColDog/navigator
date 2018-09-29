class AppsController < ApplicationController

  def index
    @apps = App.all
  end

  def new
    @app = App.new
  end

  def edit
    @app = App.find_by!(uid: params[:id])
  end

  def logs
    @app = App.find_by!(uid: params[:app_id])
  end

  def show
    @app = App.find_by!(uid: params[:id])
  end

  def create
    Apps::CreateCommand.execute(app_params)
    flash[:info] = 'Application created'
    redirect_to apps_path
  rescue ValidationError => e
    flash.now[:error] = e.errors
    render :new, status: 400
  end

  def update
    @app = App.find_by!(uid: params[:id])
    Apps::UpdateStagesCommand.execute(app_params.merge(app_id: @app.uid))
    flash.now[:info] = 'Application updated'
    render :edit
  rescue ValidationError => e
    flash.now[:error] = e.errors
    render :edit, status: 400
  end

  def destroy
    Apps::DeleteCommand.execute(app_uid: params[:id])
    flash[:info] = 'Application removed'
    redirect_to apps_path
  rescue ValidationError => e
    flash[:error] = e.errors
    redirect_to apps_path, status: 400
  end

  private

  def app_params
    params.require(:app).permit!.to_h
  end

end
